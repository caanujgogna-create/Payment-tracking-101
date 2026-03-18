import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, Modal, Alert } from 'react-native';
import { useTransactions } from '../src/useTransactions';
import { COLORS, CAT_COLORS, CAT_ICONS, CATEGORIES, fmtCur, fmtDate } from '../src/constants';

export default function Transactions() {
  const { transactions, deleteTransaction, updateCategory } = useTransactions();
  const [search,  setSearch]  = useState('');
  const [typeF,   setTypeF]   = useState('All');
  const [catModal,setCatModal]= useState(null);

  const filtered = useMemo(() => transactions.filter(t => {
    if (typeF==='Debit'  && t.type!=='debit')  return false;
    if (typeF==='Credit' && t.type!=='credit') return false;
    if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }).sort((a,b)=>new Date(b.date)-new Date(a.date)), [transactions,search,typeF]);

  const confirmDelete = (id) => Alert.alert('Delete?','Remove this transaction?',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:()=>deleteTransaction(id)},
  ]);

  return (
    <View style={{flex:1,backgroundColor:COLORS.bg}}>
      <View style={s.topBar}>
        <TextInput style={s.search} placeholder="🔍 Search..." placeholderTextColor={COLORS.text3} value={search} onChangeText={setSearch}/>
        <View style={s.pills}>
          {['All','Debit','Credit'].map(t=>(
            <TouchableOpacity key={t} style={[s.pill, typeF===t&&s.pillOn]} onPress={()=>setTypeF(t)}>
              <Text style={[s.pillTxt, typeF===t&&s.pillTxtOn]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Text style={s.count}>{filtered.length} transaction{filtered.length!==1?'s':''}</Text>
      <ScrollView contentContainerStyle={{padding:16,paddingBottom:32}}>
        {filtered.length===0
          ? <View style={s.empty}><Text style={{fontSize:44}}>📭</Text><Text style={s.emptyTxt}>No transactions found</Text></View>
          : filtered.map(tx=>(
            <View key={tx.id} style={s.card}>
              <View style={[s.icon,{backgroundColor:CAT_COLORS[tx.category]+'20'}]}>
                <Text style={{fontSize:18}}>{CAT_ICONS[tx.category]}</Text>
              </View>
              <View style={{flex:1,marginRight:8}}>
                <Text style={s.desc} numberOfLines={1}>{tx.description}</Text>
                <View style={s.tagRow}>
                  <View style={[s.tag,{backgroundColor:tx.type==='debit'?'#1e1215':'#0d1f17'}]}>
                    <Text style={[s.tagTxt,{color:tx.type==='debit'?COLORS.red:COLORS.green}]}>{tx.type}</Text>
                  </View>
                  <View style={[s.tag,{backgroundColor:CAT_COLORS[tx.category]+'22'}]}>
                    <Text style={[s.tagTxt,{color:CAT_COLORS[tx.category]}]}>{tx.source}</Text>
                  </View>
                </View>
                <Text style={s.meta}>{fmtDate(tx.date)}{tx.bank?` · ${tx.bank}`:''}</Text>
              </View>
              <View style={{alignItems:'flex-end',gap:6}}>
                <Text style={[s.amt,{color:tx.type==='debit'?COLORS.red:COLORS.green}]}>
                  {tx.type==='debit'?'-':'+'}{fmtCur(tx.amount)}
                </Text>
                <TouchableOpacity style={s.catBtn} onPress={()=>setCatModal({id:tx.id,current:tx.category})}>
                  <Text style={{fontSize:11,color:CAT_COLORS[tx.category]}}>{CAT_ICONS[tx.category]} {tx.category}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>confirmDelete(tx.id)}>
                  <Text style={{color:COLORS.red,fontSize:12}}>✕ Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>

      <Modal visible={!!catModal} transparent animationType="slide" onRequestClose={()=>setCatModal(null)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={()=>setCatModal(null)}>
          <View style={s.sheet}>
            <Text style={s.sheetTitle}>Change Category</Text>
            {CATEGORIES.map(c=>(
              <TouchableOpacity key={c} style={[s.catOpt, catModal?.current===c&&{backgroundColor:COLORS.border2}]}
                onPress={()=>{updateCategory(catModal.id,c);setCatModal(null);}}>
                <Text style={{fontSize:20}}>{CAT_ICONS[c]}</Text>
                <Text style={[s.catOptTxt,{color:catModal?.current===c?CAT_COLORS[c]:COLORS.text2}]}>{c}</Text>
                {catModal?.current===c&&<Text style={{color:CAT_COLORS[c],marginLeft:'auto'}}>✓</Text>}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  topBar:{padding:16,paddingBottom:8,gap:10},
  search:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:10,paddingHorizontal:14,paddingVertical:10,color:COLORS.text,fontSize:14},
  pills:{flexDirection:'row',gap:8},
  pill:{backgroundColor:COLORS.border,borderRadius:20,paddingHorizontal:16,paddingVertical:7},
  pillOn:{backgroundColor:'#1e3a5f'},
  pillTxt:{fontSize:13,color:COLORS.text2,fontWeight:'500'},
  pillTxtOn:{color:'#60a5fa',fontWeight:'700'},
  count:{fontSize:12,color:COLORS.text4,paddingHorizontal:16,paddingBottom:4},
  card:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:12,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center'},
  icon:{width:42,height:42,borderRadius:12,alignItems:'center',justifyContent:'center',marginRight:12},
  desc:{fontSize:14,fontWeight:'600',color:COLORS.text,marginBottom:4},
  tagRow:{flexDirection:'row',gap:6,marginBottom:4},
  tag:{borderRadius:20,paddingHorizontal:8,paddingVertical:2},
  tagTxt:{fontSize:10,fontWeight:'700'},
  meta:{fontSize:11,color:COLORS.text4},
  amt:{fontSize:15,fontWeight:'700',marginBottom:4},
  catBtn:{backgroundColor:COLORS.border,borderRadius:8,paddingHorizontal:8,paddingVertical:4},
  empty:{alignItems:'center',paddingVertical:60},
  emptyTxt:{fontSize:16,color:COLORS.text4,marginTop:12},
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'flex-end'},
  sheet:{backgroundColor:COLORS.surface,borderTopLeftRadius:20,borderTopRightRadius:20,padding:24,paddingBottom:40},
  sheetTitle:{fontSize:18,fontWeight:'700',color:COLORS.text,marginBottom:16},
  catOpt:{flexDirection:'row',alignItems:'center',gap:14,paddingVertical:12,borderBottomWidth:1,borderBottomColor:COLORS.border2,paddingHorizontal:4},
  catOptTxt:{fontSize:16,fontWeight:'500'},
});
