import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTransactions } from '../src/useTransactions';
import { COLORS, CAT_COLORS, CATEGORIES, CAT_ICONS, fmtCur, parseSMS, SAMPLE_SMS } from '../src/constants';

export default function SMS() {
  const { addTransaction } = useTransactions();
  const [smsText, setSmsText] = useState('');
  const [preview, setPreview] = useState(null);
  const [selCat,  setSelCat]  = useState('Other');

  const handleParse = () => {
    const result = parseSMS(smsText);
    if (result) { setPreview(result); setSelCat(result.category); }
    else Alert.alert('Could not parse','No transaction found. Try a different SMS format.');
  };

  const handleSave = () => {
    if (!preview) return;
    addTransaction({...preview, category:selCat});
    setSmsText(''); setPreview(null); setSelCat('Other');
    Alert.alert('✓ Saved!','Transaction added from SMS.');
  };

  return (
    <ScrollView style={s.container} contentContainerStyle={{paddingBottom:40}}>
      <View style={s.card}>
        <Text style={s.title}>📱 Parse Bank SMS</Text>
        <Text style={s.sub}>Paste any bank or UPI transaction SMS and we'll extract the details automatically.</Text>
        <TextInput style={s.input} placeholder="Paste your bank SMS here..." placeholderTextColor={COLORS.text3}
          value={smsText} onChangeText={t=>{setSmsText(t);setPreview(null);}} multiline numberOfLines={4} textAlignVertical="top"/>
        <View style={{flexDirection:'row',gap:10,marginTop:4}}>
          <TouchableOpacity style={s.btnPrimary} onPress={handleParse}><Text style={s.btnPrimaryTxt}>Parse SMS</Text></TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={()=>{setSmsText(SAMPLE_SMS[Math.floor(Math.random()*SAMPLE_SMS.length)]);setPreview(null);}}>
            <Text style={s.btnGhostTxt}>Try Sample</Text>
          </TouchableOpacity>
          {!!smsText && <TouchableOpacity style={s.btnGhost} onPress={()=>{setSmsText('');setPreview(null);}}><Text style={s.btnGhostTxt}>Clear</Text></TouchableOpacity>}
        </View>
      </View>

      {preview && (
        <View style={[s.card,{borderColor:'#1e3a5f'}]}>
          <View style={{flexDirection:'row',alignItems:'center',gap:8,marginBottom:14}}>
            <View style={{backgroundColor:'rgba(52,211,153,.15)',borderRadius:20,paddingHorizontal:10,paddingVertical:3}}>
              <Text style={{color:COLORS.green,fontSize:12,fontWeight:'700'}}>✓ Parsed</Text>
            </View>
            <Text style={{color:'#60a5fa',fontWeight:'600',fontSize:15}}>Transaction Preview</Text>
          </View>
          {[['Amount',fmtCur(preview.amount)],['Type',preview.type],['Source',preview.source],['Description',preview.description],...(preview.balance?[['Balance',fmtCur(preview.balance)]]:[])]
            .map(([k,v])=>(
            <View key={k} style={s.pRow}>
              <Text style={s.pKey}>{k}</Text>
              <Text style={[s.pVal,k==='Type'&&{color:preview.type==='debit'?COLORS.red:COLORS.green}]}>{v}</Text>
            </View>
          ))}
          <Text style={[s.secTitle,{marginTop:14,marginBottom:8}]}>CATEGORY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
            {CATEGORIES.map(c=>(
              <TouchableOpacity key={c} style={[s.catChip, selCat===c&&{backgroundColor:CAT_COLORS[c]+'33',borderColor:CAT_COLORS[c]+'88'}]} onPress={()=>setSelCat(c)}>
                <Text style={[s.catChipTxt, selCat===c&&{color:CAT_COLORS[c]}]}>{CAT_ICONS[c]} {c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={s.btnPrimary} onPress={handleSave}><Text style={s.btnPrimaryTxt}>Save Transaction</Text></TouchableOpacity>
        </View>
      )}

      <View style={s.card}>
        <Text style={s.secTitle}>TAP A SAMPLE TO LOAD</Text>
        {SAMPLE_SMS.map((sms,i)=>(
          <TouchableOpacity key={i} style={s.smsSample} onPress={()=>{setSmsText(sms);setPreview(null);}}>
            <Text style={s.smsTxt} numberOfLines={2}>{sms}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container:{flex:1,backgroundColor:COLORS.bg,padding:16},
  card:{backgroundColor:COLORS.surface,borderWidth:1,borderColor:COLORS.border,borderRadius:16,padding:18,marginBottom:14},
  title:{fontSize:18,fontWeight:'700',color:COLORS.text,marginBottom:6},
  sub:{fontSize:14,color:COLORS.text3,marginBottom:16,lineHeight:20},
  input:{backgroundColor:COLORS.bg,borderWidth:1,borderColor:COLORS.border,borderRadius:10,padding:14,color:COLORS.text,fontSize:13,lineHeight:20,minHeight:100,marginBottom:14},
  btnPrimary:{backgroundColor:'#3b82f6',borderRadius:10,paddingVertical:10,paddingHorizontal:18,alignItems:'center'},
  btnPrimaryTxt:{color:'white',fontWeight:'700',fontSize:14},
  btnGhost:{backgroundColor:COLORS.border,borderRadius:10,paddingVertical:10,paddingHorizontal:14},
  btnGhostTxt:{color:COLORS.text2,fontWeight:'600',fontSize:13},
  pRow:{flexDirection:'row',justifyContent:'space-between',paddingVertical:9,borderBottomWidth:1,borderBottomColor:COLORS.border2},
  pKey:{fontSize:14,color:COLORS.text3},
  pVal:{fontSize:14,fontWeight:'600',color:COLORS.text},
  secTitle:{fontSize:10,color:COLORS.text3,fontWeight:'700',letterSpacing:0.8},
  catChip:{backgroundColor:COLORS.border,borderRadius:20,paddingHorizontal:12,paddingVertical:7,marginRight:6,borderWidth:1,borderColor:'transparent'},
  catChipTxt:{fontSize:12,color:COLORS.text2,fontWeight:'500'},
  smsSample:{backgroundColor:COLORS.bg,borderWidth:1,borderColor:COLORS.border,borderRadius:8,padding:12,marginBottom:8},
  smsTxt:{fontSize:12,color:'#4a6080',lineHeight:18},
});
